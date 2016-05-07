using System;
using System.Collections.Generic;
using System.Threading;
using Nancy;
using Nancy.ModelBinding;
using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public class Controller : NancyModule
    {
        private Timer _poller;

        public Controller(IReworkStation reworkStation, IProgramStorage programStorage, IProgramRunStorage programRunStorage, IServerConfig serverConfig)
        {
            Get["/programs"] = _ =>
            {
                Console.WriteLine("Getting programs.");
                return JArray.FromObject(programStorage.GetPrograms()).ToString();
            };
            Post["/programs"] = _ =>
            {
                Console.WriteLine("Updating programs.");
                programStorage.UpdatePrograms(this.Bind<List<Pc900Program>>());
                return @"{""status"":""OK""}";
            };
            Post["/delete-programs"] = _ =>
            {
                Console.WriteLine("Deleting programs.");
                programStorage.DeletePrograms(this.Bind<List<Pc900Program>>());
                return @"{""status"":""OK""}";
            };
            Post["/start-program/{programId}"] = path =>
            {
                Console.WriteLine("Starting program "+ path.programId.Value + ".");
                Pc900Program program = programStorage.GetProgram(path.programId.Value);
                var programRun = reworkStation.Start(program);
                programRunStorage.AddProgramRun(programRun);

                var achiPoller = new AchiPoller(reworkStation, programRunStorage);
                _poller = new Timer(poll =>
                {
                    if (achiPoller.PollWorker(null))
                    {
                        _poller.Dispose();
                    }
                }, null, 1000, serverConfig.GetProgramRunPollingIntervalMillis());

                return JObject.FromObject(programRun).ToString();
            };
            Get["/current-run/after-point/{afterPoint}"] = path => JObject.FromObject(programRunStorage.GetProgramRuns()[0].CreatePartial(int.Parse(path.afterPoint.Value))).ToString();
            Get["/current-run"] = _ => JObject.FromObject(programRunStorage.GetProgramRuns()[0]).ToString();
        }
    }

    internal class AchiPoller
    {
        private readonly IProgramRunStorage _programRunStorage;
        private readonly IReworkStation _reworkStation;

        public AchiPoller(IReworkStation reworkStation, IProgramRunStorage programRunStorage)
        {
            _reworkStation = reworkStation;
            _programRunStorage = programRunStorage;
        }

        public bool PollWorker(object state)
        {
            if (_reworkStation.ProgramRunning())
            {
                _programRunStorage.AddToCurrentProgram(_reworkStation.GetCurrentValue());
                return false;
            }
            _programRunStorage.ProgramStopped();
            return true;
        }
    }
}

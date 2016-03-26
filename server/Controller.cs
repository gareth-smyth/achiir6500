using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using Nancy;
using Nancy.ModelBinding;
using Newtonsoft.Json.Linq;
using Nancy.Extensions;

namespace achiir6500.server
{
    public class Controller : NancyModule
    {
        private Timer _poller;

        public Controller(IReworkStation reworkStation, IProgramStorage programStorage, IProgramRunStorage programRunStorage)
        {
            Get["/programs"] = _ => JArray.FromObject(programStorage.GetPrograms()).ToString();
            Post["/programs"] = _ =>
            {
                programStorage.UpdatePrograms(this.Bind<List<Pc900Program>>());
                return @"{""status"":""OK""}";
            };
            Post["/delete-programs"] = _ =>
            {
                programStorage.DeletePrograms(this.Bind<List<Pc900Program>>());
                return @"{""status"":""OK""}";
            };
            Post["/start-program/{programId}"] = path =>
            {
                Pc900Program program = programStorage.GetProgram(path.programId.Value);
                var programRun = reworkStation.Start(program);
                programRunStorage.AddProgramRun(programRun);

                _poller = new Timer(new AchiPoller(reworkStation, programRunStorage).PollWorker, null, 0, 250);

                return JObject.FromObject(programRun).ToString();
            };
            Get["/current-run"] = _ => JObject.FromObject(programRunStorage.GetProgramRuns()[0]).ToString();
        }
    }

    internal class AchiPoller
    {
        private readonly IProgramRunStorage _programRunStorage;
        private IReworkStation _reworkStation;

        public AchiPoller(IReworkStation reworkStation, IProgramRunStorage programRunStorage)
        {
            this._reworkStation = reworkStation;
            this._programRunStorage = programRunStorage;
        }

        public void PollWorker(object state)
        {
            _programRunStorage.AddToCurrentProgram(_reworkStation.GetCurrentValue());
        }
    }
}

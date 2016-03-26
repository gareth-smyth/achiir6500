﻿using System;
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

                _poller = new Timer(new AchiPoller(reworkStation, programRunStorage).PollWorker, null, 0, serverConfig.GetProgramRunPollingIntervalMillis());

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

        public void PollWorker(object state)
        {
            if (_reworkStation.ProgramRunning())
            {
                _programRunStorage.AddToCurrentProgram(_reworkStation.GetCurrentValue());
            }
            else
            { 
                _programRunStorage.ProgramStopped();
            }
        }
    }
}

﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nancy;
using Nancy.ModelBinding;
using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public class Controller : NancyModule
    {
        public Controller(IReflowStation reflowStation, IProgramStorage programStorage)
        {
            Get["/programs"] = _ => JArray.FromObject(programStorage.GetPrograms()).ToString();
            Post["/programs"] = _ =>
            {
                programStorage.UpdatePrograms(this.Bind<Pc900Program[]>());
                return @"{""status"":""OK""}";
            };
            Post["Start-program/{programId}"] = path =>
            {
                Pc900Program program = programStorage.GetProgram(path.programId.Value);
                return JObject.FromObject(reflowStation.Start(program)).ToString();
            };
        }
    }
}

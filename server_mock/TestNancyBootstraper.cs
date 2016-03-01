using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using achiir6500.server;
using achiir6500.server_mock;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.TinyIoc;

namespace achiir6500.server_mock
{
    public class TestNancyBootstraper : DefaultNancyBootstrapper
    {
        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            container.Register<IReflowStation, MockReflowStation>().AsSingleton();
            container.Register<IProgramStorage, InMemoryProgramStorage>().AsSingleton();

            pipelines.AfterRequest += (ctx) =>
            {
                ctx.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                ctx.Response.Headers.Add("Access-Control-Allow-Methods", "POST,GET");
            };
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using achiir6500.server;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.TinyIoc;

namespace achiir6500.server_test
{
    public class TestNancyBootstraper: DefaultNancyBootstrapper
    {
        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            container.Register<IReflowStation, MockReflowStation>().AsSingleton();
        }
    }
}

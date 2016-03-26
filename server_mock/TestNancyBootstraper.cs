using achiir6500.server;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.TinyIoc;

namespace achiir6500.server_mock
{
    public class TestNancyBootstraper : DefaultNancyBootstrapper
    {
        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            container.Register<IReworkStation, MockReworkStation>().AsSingleton();
            container.Register<IProgramStorage, InMemoryProgramStorage>().AsSingleton();
            container.Register<IProgramRunStorage, InMemoryProgramRunStorage>().AsSingleton();

            pipelines.AfterRequest += ctx =>
            {
                ctx.Response.Headers.Add("Access-Control-Allow-Headers", "pragma,cache-control,content-type");
                ctx.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                ctx.Response.Headers.Add("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
            };
        }
    }
}

using Nancy;
using Nancy.Bootstrapper;
using Nancy.TinyIoc;

namespace achiir6500.server
{
    public class ProductionNancyBootstraper : DefaultNancyBootstrapper
    {
        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            container.Register<IReworkStation, ReworkStation>().AsSingleton();
            container.Register<IProgramStorage, IsolatedStorageProgramStorage>().AsSingleton();
            container.Register<IProgramRunStorage, InMemoryProgramRunStorage>().AsSingleton();
            container.Register<IServerConfig, StaticServerConfig>().AsSingleton();

            pipelines.AfterRequest += ctx =>
            {
                ctx.Response.Headers.Add("Access-Control-Allow-Headers", "content-type");
                ctx.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            };
        }
    }
}

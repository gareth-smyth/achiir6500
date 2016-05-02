using System;
using System.ComponentModel;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Hosting.Self;

namespace achiir6500.server{
    public class AchiIr500Server
    {
        private NancyHost host;

        public AchiIr500Server(INancyBootstrapper bootstrapper)
        {
            UrlReservations urlReservations = new UrlReservations {CreateAutomatically = true};
            HostConfiguration serverConfig = new HostConfiguration {UrlReservations = urlReservations};
            host = new NancyHost(bootstrapper, serverConfig, new Uri("http://localhost:9858"));
        }

        public void Start()
        {
            host.Start();
            Console.WriteLine("Achi IR6500 Server started.  Please open your browser at http://localhost:9858.");
        }

        public void Stop()
        {
            host.Stop();
        }
   
    }
}

using System;
using System.ComponentModel;
using Nancy;
using Nancy.Hosting.Self;

namespace achiir6500.server{
    public class AchiIr500Server
    {
        private NancyHost host;

        public AchiIr500Server()
        {
            UrlReservations urlReservations = new UrlReservations {CreateAutomatically = true};
            HostConfiguration serverConfig = new HostConfiguration {UrlReservations = urlReservations};
            host = new NancyHost(serverConfig, new Uri("http://localhost:9858"));
        }

        public void Start()
        {
            host.Start();
        }

        public void Stop()
        {
            host.Stop();
        }
   
    }
}

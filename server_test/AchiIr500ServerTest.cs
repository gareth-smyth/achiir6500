using System;
using NUnit.Framework;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using achiir6500.server;

namespace achiir6500.server_test
{
    [TestFixture]
    public class AchiIr500ServerTest
    {
        [SetUp]
        public void Init()
        {
            new AchiIr500Server().Start();
        }

        [Test]
        public void ShouldGetSuccessResponse()
        {
            HttpClient client = new HttpClient
            {
                BaseAddress = new Uri(@"http://localhost:9858")
            };

            // Add an Accept header for JSON format.
//            client.DefaultRequestHeaders.Accept.Add(
//                new MediaTypeWithQualityHeaderValue("application/json"));

            HttpResponseMessage response = client.GetAsync("/programs").Result;
            Assert.That(response.IsSuccessStatusCode, Is.True);
        }
    }
}
﻿using System;
using NUnit.Framework;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using achiir6500.server;
using Newtonsoft.Json;

namespace achiir6500.server_test
{
    [TestFixture]
    public class AchiIr500ServerTest
    {
        private HttpClient _client;
        private AchiIr500Server _achiIr500Server;

        [SetUp]
        public void Init()
        {
            _client = new HttpClient
            {
                BaseAddress = new Uri(@"http://localhost:9858")
            };
            _client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            _achiIr500Server = new AchiIr500Server(new TestNancyBootstraper());
            _achiIr500Server.Start();
        }

        [TearDown]
        public void After()
        {
            _achiIr500Server.Stop();
        }

        [Test]
        public void ShouldGetPrograms()
        {
            HttpResponseMessage response = _client.GetAsync("/programs").Result;

            String responseBody = response.Content.ReadAsStringAsync().Result;
            Assert.That(response.IsSuccessStatusCode, Is.True);
            Assert.That(responseBody, Contains.Substring(@"""id"": ""iamaguid_1"""));
        }

        [Test]
        public void ShouldUpdateProgram()
        {
            Pc900ProgramStep[] steps = new Pc900ProgramStep[1];
            steps[0] = new Pc900ProgramStep(10,20,40);
            Pc900Program pc900Program = new Pc900Program("iamaguid_2", "new name", 85, steps);
            Pc900Program[] programs = new Pc900Program[] {pc900Program};
            HttpResponseMessage response = _client.PostAsync("/programs", new StringContent(JArray.FromObject(programs).ToString(), Encoding.UTF8, "application/json")).Result;
            Assert.That(response.IsSuccessStatusCode, Is.True);

            response = _client.GetAsync("/programs").Result;
            String responseBody = response.Content.ReadAsStringAsync().Result;
            Assert.That(response.IsSuccessStatusCode, Is.True);
            Assert.IsFalse(responseBody.Contains(@"""loop_counter"": 35"));
            Assert.That(responseBody, Contains.Substring(@"""loop_counter"": 85"));
        }

        [Test]
        public void ShouldInsertProgram()
        {
            HttpResponseMessage response = LoadProgram();
            Assert.That(response.IsSuccessStatusCode, Is.True);

            response = _client.GetAsync("/programs").Result;
            String responseBody = response.Content.ReadAsStringAsync().Result;
            Assert.That(response.IsSuccessStatusCode, Is.True);
            Assert.That(responseBody, Contains.Substring(@"""loop_counter"": 85"));
        }

        [Test]
        public void ShouldStartProgram()
        {
            var response = StartProgram();

            var responseBody = response.Content.ReadAsStringAsync().Result;
            Assert.That(response.IsSuccessStatusCode, Is.True);
            Assert.That(responseBody, Contains.Substring(@"""program_id"": ""new_id"""));
            Assert.That(responseBody, Contains.Substring(@"""id"": """));
        }

        [Test]
        public void ShouldReturnCurrentProgramRunAfterStartingProgram()
        {
            StartProgram();
            Thread.Sleep(3000);
            var httpResponseMessage = _client.GetAsync("/current-run").Result;
            var results = JsonConvert.DeserializeObject<dynamic>(httpResponseMessage.Content.ReadAsStringAsync().Result);

            Assert.That(results.data_points.Count, Is.GreaterThan(1));
            for (var dataPoint = 0; dataPoint < results.data_points.Count; dataPoint++)
            {
                Assert.That(results.data_points[dataPoint].index.Value, Is.EqualTo(dataPoint+1));
            }
        }

        [Test]
        public void ShouldReturnProgramRunDataPastACertainPointWhenRequested()
        {
            StartProgram();
            Thread.Sleep(3000);
            var httpResponseMessage = _client.GetAsync("/current-run/after-point/3").Result;
            var results = JsonConvert.DeserializeObject<dynamic>(httpResponseMessage.Content.ReadAsStringAsync().Result);

            Assert.That(results.data_points.Count, Is.GreaterThan(1));
            for (var dataPoint = 4; dataPoint <= results.data_points.Count; dataPoint++)
            {
                Assert.That(results.data_points[dataPoint-4].index.Value, Is.EqualTo(dataPoint));
            }
        }

        [Test]
        public void ShouldReturnProgramRunDataIndicatingThatTheRunHasFinished()
        {
            StartProgram();
            Thread.Sleep(5000);
            var httpResponseMessage = _client.GetAsync("/current-run").Result;
            var results = JsonConvert.DeserializeObject<dynamic>(httpResponseMessage.Content.ReadAsStringAsync().Result);

            Assert.That(results.finished.Value, Is.True);
        }

        [Test]
        public void ShouldReturnValidEmptyProgramRunWhenNoProgramRunning()
        {
            var httpResponseMessage = _client.GetAsync("/current-run").Result;
            var results = JsonConvert.DeserializeObject<dynamic>(httpResponseMessage.Content.ReadAsStringAsync().Result);

            Assert.That(results.finished.Value, Is.True);
        }

        private HttpResponseMessage StartProgram()
        {
            LoadProgram();
            return _client.PostAsync("/start-program/new_id", new StringContent("")).Result;
        }

        private HttpResponseMessage LoadProgram()
        {
            Pc900ProgramStep[] steps = new Pc900ProgramStep[1];
            steps[0] = new Pc900ProgramStep(10, 20, 40);
            Pc900Program pc900Program = new Pc900Program("new_id", "new name", 85, steps);
            Pc900Program[] programs = { pc900Program };
            HttpResponseMessage response =
                _client.PostAsync("/programs",
                    new StringContent(JArray.FromObject(programs).ToString(), Encoding.UTF8, "application/json")).Result;
            return response;
        }
    }
}
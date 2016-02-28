using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;
using achiir6500.server;

namespace achiir6500.server_test
{
    [TestFixture]
    class Pc900TranslatorTest
    {
        readonly StartCommand startCommand = new Pc900Translator().StartCommand("1234");

        [Test]
        public void ShouldReturnSerialCommandForStart()
        {
            List<List<byte>> commandsList = startCommand.CommandsList;
            Assert.That(commandsList[0], Is.EqualTo(new List<byte>() { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x23, 0x33, 0x30, 0x30, 0x30, 0x31, 0x03, 0x12 }));
        }

        [Test]
        public void ShouldReturnSuccessResponseForPositiveAcknowledge()
        {
            StartCommandResponse startCommandResponse = startCommand.ResponseDelegate.Invoke(new List<byte>() { 0x06 });
            Assert.That(startCommandResponse.Succeeded, Is.True);
        }

        [Test]
        public void ShouldReturnFailureResponseForNegativeAcknowledge()
        {
            StartCommandResponse startCommandResponse = startCommand.ResponseDelegate.Invoke(new List<byte>() { 0x15 });
            Assert.That(startCommandResponse.Succeeded, Is.False);
        }
    }
}

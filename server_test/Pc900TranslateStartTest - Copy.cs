using System.Collections.Generic;
using NUnit.Framework;
using achiir6500.server;

namespace achiir6500.server_test
{
    [TestFixture]
    class Pc900TranslateStartTest
    {
        private readonly Pc900Command _pc900Command = new Pc900Translator().StartCommand("1234");

        [Test]
        public void ShouldReturnSerialCommandForStart()
        {
            var commandsList = _pc900Command.CommandsList;
            Assert.That(commandsList[0], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x23, 0x33, 0x30, 0x30, 0x30, 0x31, 0x03, 0x12 }));
        }

        [Test]
        public void ShouldReturnSuccessResponseForPositiveAcknowledge()
        {
            var startCommandResponse = (StartCommandResponse)_pc900Command.ResponseDelegate.Invoke(new List<byte> { 0x06 });
            Assert.That(startCommandResponse.Succeeded, Is.True);
        }

        [Test]
        public void ShouldReturnFailureResponseForNegativeAcknowledge()
        {
            var startCommandResponse = (StartCommandResponse)_pc900Command.ResponseDelegate.Invoke(new List<byte> { 0x15 });
            Assert.That(startCommandResponse.Succeeded, Is.False);
        }
    }
}

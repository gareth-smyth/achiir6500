using System.Collections.Generic;
using NUnit.Framework;
using achiir6500.server;

namespace achiir6500.server_test
{
    [TestFixture]
    class Pc900TranslateGetCurrentValueTest
    {
        private readonly Pc900Command _pc900Command = new Pc900Translator().GetCurrentValueCommand();

        [Test]
        public void ShouldReturnSerialCommandForStart()
        {
            var commandsList = _pc900Command.CommandsList;
            Assert.That(commandsList[0], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x50, 0x56, 0x05 }));
        }

        [Test]
        public void ShouldReturnTemperatureSuppliedByReworkStation()
        {
            var currentValue22 = new List<byte> { 0x02, 0x50, 0x56, 0x20, 0x20, 0x32, 0x32, 0x2E, 0x03, 0x2B };
            var getCurrentValueCommandResponse = (GetCurrentValueCommandResponse)_pc900Command.ResponseDelegate.Invoke(currentValue22);
            Assert.That(getCurrentValueCommandResponse.Value, Is.EqualTo(22));
        }
        
    }
}

using System;
using System.Collections.Generic;
using NUnit.Framework;
using achiir6500.server;

namespace achiir6500.server_test
{
    [TestFixture]
    class Pc900TranslateCurrentlyRunningTest
    {
        private readonly Pc900Command _pc900Command = new Pc900Translator().CurrentlyRunningCommand();

        [Test]
        public void ShouldReturnSerialCommandForCurrentlyRunning()
        {
            var commandsList = _pc900Command.CommandsList;
            Assert.That(commandsList[0], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x23, 0x33, 0x05 }));
        }

        [Test]
        public void ShouldReturnTrueIfWorkstationIsCurrentlyRunning()
        {
            var currentlyRunningTrue = new List<byte> { 0x02, 0x23, 0x33, 0x20, 0x20, 0x20, 0x31, 0x2E, 0x03, 0x2C };
            var currentlyRunningCommandResponse = (CurrentlyRunningCommandResponse)_pc900Command.ResponseDelegate.Invoke(currentlyRunningTrue);
            Assert.That(currentlyRunningCommandResponse.Running, Is.True);
        }

        [Test]
        public void ShouldReturnFalseIfWorkstationIsCurrentlyStopped()
        {
            var currentlyRunningFalse = new List<byte> { 0x02, 0x23, 0x33, 0x20, 0x20, 0x20, 0x30, 0x2E, 0x03, 0x2D };
            var currentlyRunningCommandResponse = (CurrentlyRunningCommandResponse)_pc900Command.ResponseDelegate.Invoke(currentlyRunningFalse);
            Assert.That(currentlyRunningCommandResponse.Running, Is.False);
        }
    }
}

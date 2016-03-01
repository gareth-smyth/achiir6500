﻿using System;
using System.Collections.Generic;
using NUnit.Framework;
using achiir6500.server;

namespace achiir6500.server_test
{
    [TestFixture]
    class Pc900TranslateLoadTest
    {
        [Test]
        public void ShouldReturnListOfCommandsToLoadProgram()
        {
            Pc900ProgramStep[] steps = {
                new Pc900ProgramStep(0, 0, 360),
                new Pc900ProgramStep(1, 180, 45)
            };
            var program = new Pc900Program(Guid.NewGuid().ToString(), "Program1", 1, steps);
            var loadCommand = new Pc900Translator().LoadCommand(program);
            var commandsList = loadCommand.CommandsList;

            Assert.That(commandsList[0], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x72, 0x31, 0x30, 0x30, 0x2E, 0x30, 0x30, 0x03, 0x6E }));
            Assert.That(commandsList[1], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x6c, 0x31, 0x30, 0x30, 0x30, 0x30, 0x03, 0x5E }));
            Assert.That(commandsList[2], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x74, 0x31, 0x30, 0x33, 0x36, 0x30, 0x03, 0x43 }));
            Assert.That(commandsList[3], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x72, 0x32, 0x30, 0x31, 0x2E, 0x30, 0x30, 0x03, 0x6C }));
            Assert.That(commandsList[4], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x6c, 0x32, 0x30, 0x31, 0x38, 0x30, 0x03, 0x54 }));
            Assert.That(commandsList[5], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x74, 0x32, 0x30, 0x30, 0x34, 0x35, 0x03, 0x44 }));

            Assert.That(commandsList[6], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x72, 0x33, 0x30, 0x30, 0x2E, 0x30, 0x30, 0x03, 0x6C }));
            Assert.That(commandsList[7], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x6c, 0x33, 0x30, 0x30, 0x30, 0x30, 0x03, 0x5C }));
            Assert.That(commandsList[8], Is.EqualTo(new List<byte> { 0x04, 0x30, 0x30, 0x31, 0x31, 0x02, 0x74, 0x33, 0x30, 0x30, 0x30, 0x30, 0x03, 0x44 }));
        }
    }
}
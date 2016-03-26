using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;

namespace achiir6500.server
{
    public class ReworkStation: IReworkStation
    {
        public Pc900ProgramRun Start(Pc900Program program)
        {
            LoadRun(program);
            var port = CreateAndOpenPort();
            var pc900Translator = new Pc900Translator();

            Console.WriteLine("Sending Start command");
            var command = pc900Translator.StartCommand(program.id);
            ExecuteCommand(command, port);
            
            port.Close();

            return new Pc900ProgramRun("1234");
        }

        public int GetCurrentValue()
        {
            var port = CreateAndOpenPort();
            var pc900Translator = new Pc900Translator();

            Console.WriteLine("Sending GetCurrentValue command");
            var command = pc900Translator.GetCurrentValueCommand();
            var responses = ExecuteCommand(command, port);

            port.Close();

            return ((GetCurrentValueCommandResponse)responses[0]).Value;
        }

        public bool ProgramRunning()
        {
            var port = CreateAndOpenPort();
            var pc900Translator = new Pc900Translator();

            Console.WriteLine("Sending Currently Running command");
            var command = pc900Translator.CurrentlyRunningCommand();
            var responses = ExecuteCommand(command, port);

            port.Close();

            return ((CurrentlyRunningCommandResponse)responses[0]).Running;
        }

        public void LoadRun(Pc900Program program)
        {
            var port = CreateAndOpenPort();
            var pc900Translator = new Pc900Translator();

            Console.WriteLine("Sending Load commands");
            var command = pc900Translator.LoadCommand(program);
            ExecuteCommand(command, port);

            port.Close();
        }

        private static List<CommandResponse> ExecuteCommand(Pc900Command command, SerialPort myPort)
        {
            List <CommandResponse> responses = new List<CommandResponse>();

            foreach (var buffer in command.CommandsList.Select(byteList => byteList.ToArray()))
            {
                myPort.Write(buffer, 0, buffer.Length);
                var readBuffer = ReadBuffer(buffer, myPort);
                responses.Add(command.ResponseDelegate(readBuffer.ToList()));
            }
            return responses;
        }

        private static SerialPort CreateAndOpenPort()
        {
            var myPort = new SerialPort("COM1")
            {
                BaudRate = 9600,
                DtrEnable = true,
                RtsEnable = true,
                DataBits = 7,
                Parity = Parity.Even,
                StopBits = StopBits.One
            };

            if (myPort.IsOpen == false)
                myPort.Open();
            return myPort;
        }

        private static byte[] ReadBuffer(byte[] buffer, SerialPort myPort)
        {
            Console.WriteLine("Sent:" + string.Join(", ", buffer));
            var readBuffer = new byte[1];
            myPort.Read(readBuffer, 0, 1);
            Console.WriteLine(readBuffer[0]);
            return readBuffer;
        }
    }
}

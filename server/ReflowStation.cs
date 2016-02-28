using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public class ReflowStation: IReflowStation
    {
        public Pc900ProgramRun start(Pc900Program program)
        {
            System.IO.Ports.SerialPort myPort = new System.IO.Ports.SerialPort("COM1");
            myPort.BaudRate = 9600;

            if (myPort.IsOpen == false) 
                myPort.Open();

            var pc900Translator = new Pc900Translator();

            Console.WriteLine("Sending start command");
            var startCommand = pc900Translator.StartCommand(program.id);
            foreach (var command in startCommand.CommandsList)
            {
                byte[] buffer = command.ToArray();
                Console.WriteLine("Sent:" + string.Join(", ", buffer));
                myPort.Write(buffer, 0, buffer.Length);

                byte ackByte = Convert.ToByte(myPort.ReadByte());
                Console.WriteLine("Received:"+ackByte);
                startCommand.ResponseDelegate(new List<byte> {ackByte});
            }
            
            myPort.Close();

            return new Pc900ProgramRun("1234");
        }
    }
}

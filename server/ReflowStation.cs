using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading;
using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public class ReflowStation: IReflowStation
    {
        public Pc900ProgramRun start(Pc900Program program)
        {
            System.IO.Ports.SerialPort myPort = new System.IO.Ports.SerialPort("COM1");
            myPort.BaudRate = 9600;
            myPort.DtrEnable = true;
            myPort.RtsEnable = true;
            myPort.ReadBufferSize = 8;
            myPort.DataBits = 7;
            myPort.Parity = Parity.Even;
            myPort.StopBits = StopBits.One;

            if (myPort.IsOpen == false) 
                myPort.Open();

            var pc900Translator = new Pc900Translator();

            Console.WriteLine("Sending start command");
            var startCommand = pc900Translator.StartCommand("1");
            foreach (var command in startCommand.CommandsList)
            {
                byte[] buffer = command.ToArray();
                
                myPort.Write(buffer, 0, buffer.Length);
                Console.WriteLine("Sent:" + string.Join(", ", buffer));
                Console.WriteLine("Receiving bytes");
                int bytes = myPort.BytesToRead;
                Console.WriteLine("Receiving bytes:"+bytes);
                byte[] readBuffer = new byte[bytes];
                myPort.Read(readBuffer, 0, bytes);
                startCommand.ResponseDelegate(readBuffer.ToList());
            }
            
            myPort.Close();

            return new Pc900ProgramRun("1234");
        }
    }
}

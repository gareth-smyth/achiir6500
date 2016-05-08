using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Threading;

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
            
            try
            {
                ExecuteCommand(command, port);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine(e.StackTrace);
            }
            finally
            {
                port.Close();
            }

            return new Pc900ProgramRun("1234");
        }

        public int GetCurrentValue()
        {
            var port = CreateAndOpenPort();
            var pc900Translator = new Pc900Translator();

            Console.WriteLine("Sending GetCurrentValue command");
            var command = pc900Translator.GetCurrentValueCommand();

            List<CommandResponse> responses;
            try
            {
                responses = ExecuteCommand(command, port);
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine(e.StackTrace);
                return 0;
            }
            finally
            {
                port.Close();
            }

            return ((GetCurrentValueCommandResponse)responses[0]).Value;
        }

        public bool ProgramRunning()
        {
            var port = CreateAndOpenPort();
            var pc900Translator = new Pc900Translator();

            Console.WriteLine("Sending Currently Running command");
            var command = pc900Translator.CurrentlyRunningCommand();

            List<CommandResponse> responses;
            try
            {
                responses = ExecuteCommand(command, port);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine(e.StackTrace);
                return false;
            }
            finally
            {
                port.Close();
            }

            return ((CurrentlyRunningCommandResponse)responses[0]).Running;
        }

        public void LoadRun(Pc900Program program)
        {
            var port = CreateAndOpenPort();
            var pc900Translator = new Pc900Translator();

            Console.WriteLine("Sending Load commands");
            var command = pc900Translator.LoadCommand(program);
            
            try
            {
                ExecuteCommand(command, port);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine(e.StackTrace);
            }
            finally
            {
                port.Close();
            }
        }

        private static List<CommandResponse> ExecuteCommand(Pc900Command command, SerialPort myPort)
        {
            List <CommandResponse> responses = new List<CommandResponse>();

            foreach (var buffer in command.CommandsList.Select(byteList => byteList.ToArray()))
            {
                myPort.Write(buffer, 0, buffer.Length);
                Console.WriteLine("Sent:" + string.Join(", ", buffer));
                var readBuffer = ReadBuffer(myPort, command.ExpectedResponseBytes);
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

        private static byte[] ReadBuffer(SerialPort myPort, int numResponseBytes)
        {
            var readBuffer = new byte[numResponseBytes];
            var bytesRead = 0;
            while (bytesRead < numResponseBytes)
            {
                int bytesToRead = myPort.BytesToRead;
                if (bytesToRead > 0)
                {
                    var partialBuffer = new byte[bytesToRead];
                    var lastByteIndex = bytesRead;
                    bytesRead += myPort.Read(partialBuffer, 0, bytesToRead);
                    Console.WriteLine("Received:" + string.Join(", ", partialBuffer));
                    Array.Copy(partialBuffer, 0, readBuffer, lastByteIndex, bytesRead);
                }
                Thread.Sleep(100);
            }
            Console.WriteLine("Received:" + string.Join(", ", readBuffer));
            return readBuffer;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace achiir6500.server
{
    public class Pc900Translator
    {
        private readonly byte EOT = 0x04;                                               // End of Transmission
        private readonly byte STX = 0x02;                                               // Start of text
        private readonly byte ETX = 0x03;                                               // End of text
        private readonly byte ENQ = 0x05;                                               // Enquire
        private readonly List<byte> ADR_1 = Encoding.ASCII.GetBytes("0011").ToList();   // Instrument address 1
        private readonly List<byte> START = Encoding.ASCII.GetBytes("#30001").ToList(); // Start
        private readonly byte START_BCC = 0x12;                                         // Start checksum
        private static readonly byte ACK = 0x06;                                        // Positive acknowledge
        private static readonly byte NAK = 0x15;                                        // Negative acknowledge
        private readonly List<byte> PV = Encoding.ASCII.GetBytes("PV").ToList();        // PV (Current value)
        private readonly List<byte> RUNNING = Encoding.ASCII.GetBytes("#3").ToList();        // Is the rework station currently running a program
        public Pc900Command StartCommand(string programId)
        {
            var commandsList = new List<List<byte>> { GenerateCommandWithBcc(ADR_1, START) };

            return new Pc900Command(commandsList, StartCommandResponseDelegate(programId));
        }

        public static Func<List<byte>, StartCommandResponse> StartCommandResponseDelegate(string programId)
        {
            Func<List<byte>, StartCommandResponse> handleResponse =
                commandResponse =>
                    commandResponse[0] == ACK
                        ? StartCommandResponse.Success(new Pc900ProgramRun(programId))
                        : StartCommandResponse.Failure(new Pc900ProgramRun(programId));
            return handleResponse;
        }

        public Pc900Command LoadCommand(Pc900Program program)
        {
            List<List<byte>> commandsList = new List<List<byte>>();

            for(byte stepIdx=1; stepIdx<program.steps.Length+1; stepIdx++)
            {
                var step = program.steps[stepIdx-1];
                commandsList.Add(GenerateCommandWithBcc(ADR_1, Ramp(stepIdx, step.ramp)));
                commandsList.Add(GenerateCommandWithBcc(ADR_1, Level(stepIdx, step.level)));
                commandsList.Add(GenerateCommandWithBcc(ADR_1, Dwell(stepIdx, step.dwell)));
            }

            return new Pc900Command(commandsList, LoadCommandResponseDelegate(program));
        }

        public static Func<List<byte>, CommandResponse> LoadCommandResponseDelegate(Pc900Program program)
        {
            Func<List<byte>, CommandResponse> handleResponse = commandResponse => new CommandResponse();
            return handleResponse;
        }

        public Pc900Command GetCurrentValueCommand()
        {
            var commandsList = new List<List<byte>> { GenerateEnquiryCommand(ADR_1, PV) };

            return new Pc900Command(commandsList, GetCurrentValueCommandResponseDelegate());
        }

        public static Func<List<byte>, GetCurrentValueCommandResponse> GetCurrentValueCommandResponseDelegate()
        {
            Func<List<byte>, GetCurrentValueCommandResponse> handleResponse =
                commandResponse =>
                {
                    int readValue = int.Parse(Encoding.ASCII.GetString(commandResponse.GetRange(3, 4).ToArray()));
                    return new GetCurrentValueCommandResponse(readValue);
                };
            return handleResponse;
        }

        public Pc900Command CurrentlyRunningCommand()
        {
            var commandsList = new List<List<byte>> { GenerateEnquiryCommand(ADR_1, RUNNING) };

            return new Pc900Command(commandsList, CurrentlyRunningCommandResponseDelegate());
        }

        public static Func<List<byte>, CurrentlyRunningCommandResponse> CurrentlyRunningCommandResponseDelegate()
        {
            Func<List<byte>, CurrentlyRunningCommandResponse> handleResponse =
                commandResponse =>
                {
                    bool running = Convert.ToBoolean(Convert.ToByte(Encoding.ASCII.GetString(commandResponse.GetRange(3, 4).ToArray()).Trim()));
                    return new CurrentlyRunningCommandResponse(running);
                };
            return handleResponse;
        }

        private static List<byte> Ramp(byte stepIdx, double ramp)
        {
            var rampPoint = new List<byte> { 0x72, Encoding.ASCII.GetBytes(stepIdx.ToString("0"))[0]};
            return rampPoint.Concat(Encoding.ASCII.GetBytes(ramp.ToString("00.00")).ToList()).ToList();
        }

        private static List<byte> Level(byte stepIdx, double ramp)
        {
            var level = new List<byte> { 0x6C, Encoding.ASCII.GetBytes(stepIdx.ToString("0"))[0] };
            return level.Concat(Encoding.ASCII.GetBytes(ramp.ToString("0000")).ToList()).ToList();
        }

        private static List<byte> Dwell(byte stepIdx, double ramp)
        {
            var dwell = new List<byte> { 0x74, Encoding.ASCII.GetBytes(stepIdx.ToString("0"))[0] };
            return dwell.Concat(Encoding.ASCII.GetBytes(ramp.ToString("0000")).ToList()).ToList();
        }

        private List<byte> GenerateEnquiryCommand(List<byte> address, List<byte> data)
        {
            var command = new List<byte> {EOT};
            command.AddRange(address);
            command.AddRange(data);
            command.Add(ENQ);

            return command;
        }

        private List<byte> GenerateCommandWithBcc(List<byte> address, List<byte> data)
        {
            var preBcc = new List<byte>();
            preBcc.Add(EOT);
            preBcc.AddRange(address);
            preBcc.Add(STX);

            var toBcc = new List<byte>();
            toBcc.AddRange(data);
            toBcc.Add(ETX);

            var bcc = new List<byte> { toBcc.Aggregate((acc, val) => (byte)(acc ^ val)) };

            return preBcc.Concat(toBcc).Concat(bcc).ToList();
        }
    }
}

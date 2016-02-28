using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace achiir6500.server
{
    public class Pc900Translator
    {
        private readonly byte EOT = 0x04;                                   // End of Transmission
        private readonly byte STX = 0x02;                                   // Start of text
        private readonly byte ETX = 0x03;                                   // End of text
        private readonly byte[] ADR_1 = Encoding.ASCII.GetBytes("0011");    // Instrument address 1
        private readonly byte[] START = Encoding.ASCII.GetBytes("#30001");  // Start command
        private readonly byte START_BCC = 0x12;                             // Start checksum
        private static readonly byte ACK = 0x06;                            // Positive acknowledge
        private static readonly byte NAK = 0x15;                            // Negative acknowledge

        public StartCommand StartCommand(string programId)
        {
            List<byte> buffer = new List<byte>();
            buffer.Add(EOT);
            buffer.AddRange(ADR_1);
            buffer.Add(STX);
            buffer.AddRange(START);
            buffer.Add(ETX);
            buffer.Add(START_BCC);
            List<List<byte>> commandsList = new List<List<byte>>();
            commandsList.Add(buffer);

            return new StartCommand(commandsList, StartCommandResponseDelegate(programId));
        }

        public static Func<List<byte>, StartCommandResponse> StartCommandResponseDelegate(string programId)
        {
            Func<List<byte>, StartCommandResponse> handleResponse = delegate (List<byte> commandResponse)
            {
                if (commandResponse[0] == ACK)
                {
                    return StartCommandResponse.Success(new Pc900ProgramRun(programId));
                }
                return StartCommandResponse.Failure(new Pc900ProgramRun(programId));
            };
            return handleResponse;
        }
    }
}

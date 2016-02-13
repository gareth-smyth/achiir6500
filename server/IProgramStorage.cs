﻿using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public interface IProgramStorage
    {
        List<Pc900Program> GetPrograms();
        void UpdatePrograms(Pc900Program[] pc900Programs);
        Pc900Program GetProgram(string programId);
    }
}

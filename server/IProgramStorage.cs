﻿using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public interface IProgramStorage
    {
        JArray GetPrograms();
        void UpdatePrograms(Pc900Program[] pc900Programs);
    }
}

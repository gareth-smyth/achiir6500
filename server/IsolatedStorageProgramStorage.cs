using System.Collections.Generic;
using System.IO;
using System.IO.IsolatedStorage;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public class IsolatedStorageProgramStorage : IProgramStorage
    {
        private const string SaveFileName = "achiir6500_programs.json";

        public List<Pc900Program> GetPrograms()
        {
            var isoStore = IsolatedStorageFile.GetStore(IsolatedStorageScope.User | IsolatedStorageScope.Assembly, null,
                null);

            return isoStore.FileExists(SaveFileName) ? DeserializeObject(isoStore) : CreateInitialStorage();
        }

        public void UpdatePrograms(List<Pc900Program> pc900Programs)
        {
            var programs = GetPrograms();
            pc900Programs.ForEach(program =>
            {
                var currentProgram = GetProgram(program.id);
                if (currentProgram == null)
                {
                    programs.Add(program);
                }
                else
                {
                    var currentIndex = programs.FindIndex(findProgram => findProgram.id == currentProgram.id);
                    programs[currentIndex] = program;
                }
            });
            SavePrograms(programs);
        }

        public void DeletePrograms(List<Pc900Program> pc900Programs)
        {
            var programs = GetPrograms();
            programs.RemoveAll(program => pc900Programs.Select(deletedProgram => deletedProgram.id).Contains(program.id));
            SavePrograms(programs);
        }

        public Pc900Program GetProgram(string programId)
        {
            var programs = GetPrograms();
            return FindProgram(programId, programs);
        }

        private static Pc900Program FindProgram(string programId, List<Pc900Program> programs)
        {
            return programs.Find(program => program.id == programId);
        }

        private static List<Pc900Program> DeserializeObject(IsolatedStorageFile isoStore)
        {
            using (var isoStream = new IsolatedStorageFileStream(SaveFileName, FileMode.Open, isoStore))
            {
                var programsJson = new StreamReader(isoStream).ReadToEnd();
                return JsonConvert.DeserializeObject<List<Pc900Program>>(programsJson);
            }
        }

        private static List<Pc900Program> CreateInitialStorage()
        {
            var programs = new List<Pc900Program>();

            var program0Steps = new Pc900ProgramStep[3];
            program0Steps[0] = new Pc900ProgramStep(1, 25, 35);
            program0Steps[1] = new Pc900ProgramStep(1, 30, 35);
            program0Steps[2] = new Pc900ProgramStep(0.01, 25, 1);
            programs.Add(new Pc900Program("example_1", "Example One", 1, program0Steps));

            var program1Steps = new Pc900ProgramStep[3];
            program1Steps[0] = new Pc900ProgramStep(1, 55, 10);
            program1Steps[1] = new Pc900ProgramStep(1, 75, 15);
            program1Steps[2] = new Pc900ProgramStep(0.01, 45, 25);
            programs.Add(new Pc900Program("example_2", "Example Two", 1, program1Steps));

            SavePrograms(programs);

            return programs;
        }

        private static void SavePrograms(List<Pc900Program> programs)
        {
            var isoStore = IsolatedStorageFile.GetStore(IsolatedStorageScope.User | IsolatedStorageScope.Assembly, null,
                null);
            using (
                var isoStream = new IsolatedStorageFileStream(SaveFileName, FileMode.Create, isoStore))
            {
                using (var writer = new StreamWriter(isoStream))
                {
                    writer.WriteLine(JArray.FromObject(programs).ToString());
                }
            }
        }
    }
}
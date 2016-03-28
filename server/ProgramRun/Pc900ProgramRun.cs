using System;
using System.Collections.Generic;

namespace achiir6500.server
{
    public class Pc900ProgramRun
    {
        public string id;
        public string program_id;
        public List<Pc900ProgramRunDataPoint> data_points;
        public int end_point;
        public int initial_point = 1;
        public bool finished = false;

        public Pc900ProgramRun(string programId)
        {
            id = Guid.NewGuid().ToString();
            program_id = programId;
            data_points = new List<Pc900ProgramRunDataPoint>();
        }

        public void AddDataPoint(int value)
        {
            lock (data_points)
            {
                end_point++;
                data_points.Add(new Pc900ProgramRunDataPoint(end_point, value, DateTime.Now));
            }
        }

        private void AddDataPoint(Pc900ProgramRunDataPoint dataPoint)
        {
            lock (data_points)
            {
                end_point++;
                data_points.Add(new Pc900ProgramRunDataPoint(end_point, dataPoint.value, dataPoint.timestamp));
            }
        }

        public Pc900ProgramRun CreatePartial(int fromPoint)
        {
            var partial = new Pc900ProgramRun(program_id)
            {
                initial_point = fromPoint,
                id = id,
                end_point = fromPoint
            };
            lock (data_points)
            {
                foreach (var dataPoint in data_points)
                {
                    partial.AddDataPoint(dataPoint);
                }
            }
            return partial;
        }
    }
}
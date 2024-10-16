"use client";
import { cn } from "@/lib/utils";
import { formatCurrencyJP } from "@/utils/Helpers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
// const data = [
//   {
//     name: "January",
//     sales: 1400,
//   },
//   {
//     name: "February",
//     sales: 1398,
//   },
//   {
//     name: "March",
//     sales: 2800,
//   },
//   {
//     name: "April",
//     sales: 3908,
//   },
//   {
//     name: "May",
//     sales: 4800,
//   },
//   {
//     name: "June",
//     sales: 3490,
//   },
//   {
//     name: "July",
//     sales: 4300,
//   },
//   {
//     name: "August",
//     sales: 3490,
//   },
//   {
//     name: "September",
//     sales: 3490,
//   },
//   {
//     name: "October",
//     sales: 3490,
//   },
//   {
//     name: "November",
//     sales: 3490,
//   },
//   {
//     name: "December",
//     sales: 3490,
//   },
// ];
export default function SalesChart({ className, data, isLoading }: { className?: string, data: any, isLoading: boolean }) {
  if(isLoading || !data) return <p>Loading...</p>

  const computePercentage = (month: string) => {
    let index = data.findIndex((record: any) => record.BillingMonth == month)
    if(index === 0) {    
      return ""
    }
    if(data[index].Sales > data[index-1].Sales){
      return `+ ${((data[index].Sales - data[index-1].Sale) / data[index-1].Sales * 100).toFixed(2)}% vs previous month.`
    }
    else {
      return `- ${((data[index-1].Sales - data[index].Sales) / data[index-1].Sales * 100).toFixed(2)}% vs previous month.`
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-cstm-primary p-4">
          <p className="label font-bold">{`${label}`}</p>
          <p className="intro">₱{formatCurrencyJP(payload[0].value)}</p>
          <p> 
            {
              computePercentage(label)
            }
          </p>
        </div>
      );
    }
  }

  return (
    <div className={cn("m-4", className)}>
      <ResponsiveContainer width={"100%"} height={400}>
        <LineChart width={1600} height={400} data={data}>
          <CartesianGrid vertical horizontal={false} stroke={"#fff"} />
          <XAxis name="Month" dataKey="BillingMonth" tick={{ fill: "hsl(206, 88%, 94%, 1)" }} />
          <YAxis
            tick={{ fill: "hsl(206, 88%, 94%, 1)" }}
            tickFormatter={(x) => `₱ ${x}`}
            width={80}
          />
          <Tooltip
            content={<CustomTooltip />}
            contentStyle={{
              backgroundColor: "hsla(203, 63%, 20%, 1)",
              borderRadius: "15px",
              color: "white",
              
            }}
          />
          <Legend />
          <Line
            name="Sales"
            type="monotone"
            dataKey="Sales"
            stroke="hsl(206, 88%, 94%, 1)"
            strokeWidth={2.5}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

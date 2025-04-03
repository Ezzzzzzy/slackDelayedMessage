"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import _ from "lodash";
import { ChangeEvent, useState } from "react"
interface Data {
  delay: number | "";
  delayType: string;
  message: string;
  webhook: string;
}
export default function Home() {
  const [data, setData] = useState<Data>({
    delay: "",
    delayType: "",
    message: "",
    webhook: "",
  });

  const handleDelayTypeChange = (value: string) =>{
    setData({
      ...data,
      delayType: value,
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.id]: e.target.value,
    })
  };

  const handleSend = () => {
    const { delay, delayType, message, webhook } = data;
    if (!delay || !message || !webhook) return;

    const delayTime = calculateDelay(Number(delay) || 0, delayType);

    setTimeout(async () => {
      try {
        const response = await fetch('api/sendMessage', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            webhook,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        alert("Message sent successfully!");
      } catch (error) {
        alert("Error sending message");
        console.error("Error:", error);
      } finally {
        handleClear()
      }
    }, delayTime);
  }

  const handleClear = () => {
    setData({
      delay: "",
      delayType: "",
      message: "",
      webhook: "",
    })
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Send Delayed Messages</CardTitle>
        <CardDescription>This project enables you to send delayed messages using slack api</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">Delay</Label>
            <div className="flex flex-row space-x-2">
              <Input id="delay" value={data.delay} type="number" placeholder="Add delay" onChange={(e)=>handleChange(e)} />
              <Select value={data.delayType} onValueChange={handleDelayTypeChange}>
                <SelectTrigger id="delayType">
                  <SelectValue placeholder="Delay type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="seconds">seconds</SelectItem>
                  <SelectItem value="minutes">minutes</SelectItem>
                  <SelectItem value="hours">hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Input id="message" placeholder="Enter Message" value={data.message} onChange={(e)=>handleChange(e)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="webhook">Webhook URL</Label>
              <Input id="webhook" placeholder="Enter Webhook URL" value={data.webhook} onChange={(e)=>handleChange(e)} />
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={()=>handleSend()}>{data.delay && data.delayType ? `Send in ${data.delay} ${data.delayType}` : 'Send'}</Button>
        <Button onClick={handleClear} variant="outline">Clear</Button>
      </CardFooter>
    </Card>
      </main>
    </div>
  );
}

const calculateDelay = (delay: number, unit: string) => {
  const timeMultipliers = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
  };

  return delay * _.get(timeMultipliers, unit, 1000);
};
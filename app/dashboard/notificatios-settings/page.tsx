"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NotificationSettings = () => {
  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState("30");
  const [unit, setUnit] = useState("days");
  const [alerts, setAlerts] = useState("3");

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    console.log({
      enabled,
      frequency: Number(frequency),
      unit,
      numberOfAlerts: Number(alerts),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Inactivity Notification Settings</CardTitle>
          <CardDescription>
            Configure when and how often you want to receive inactivity alerts
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Enable/Disable Switch */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive alerts when your account is inactive
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {enabled && (
            <>
              {/* Check Frequency */}
              <div className="space-y-2">
                <Label>Check Frequency</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      min="1"
                      placeholder="Enter number"
                    />
                  </div>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-gray-500">
                  How often to check for inactivity
                </p>
              </div>

              {/* Number of Alerts */}
              <div className="space-y-2">
                <Label>Number of Alerts</Label>
                <Input
                  type="number"
                  value={alerts}
                  onChange={(e) => setAlerts(e.target.value)}
                  min="1"
                  max="10"
                  placeholder="Number of alerts"
                />
                <p className="text-sm text-gray-500">
                  How many alerts to send before assuming inactivity
                </p>
              </div>

              {/* Alert Preview */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Preview</AlertTitle>
                <AlertDescription>
                  You will receive {alerts} notification
                  {Number(alerts) > 1 ? "s" : ""} every {frequency} {unit}
                  {Number(frequency) > 1 ? "s" : ""} when inactive.
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={handleSave} className="ml-auto">
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;

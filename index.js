#!/usr/bin/env node //run the script with the node that is why it is using the shebang

const fs = require("fs"); //for file read write system
const path = require("path"); //works with files and directory paths
const os = require("os"); // providing os platform usage memory, platform etc
const { exec } = require("child_process"); //for ping, ps means process list, kill, disk, mem

// Command-line arguments পাওয়া
const args = process.argv.slice(2); //
const command = args[0];

// 1. ফাইল লিস্ট করা
if (command === "ls") {
  const dir = args[1] || ".";
  fs.readdir(dir, (err, files) => {
    if (err) return console.error("Error:", err.message);
    files.forEach((file) => console.log(file));
  });
}

// 2. নতুন ফাইল তৈরি করা
else if (command === "touch") {
  const filename = args[1];
  if (!filename) return console.log("Please provide a file name.");
  fs.writeFileSync(filename, "");
  console.log(`File '${filename}' created.`);
}

// 3. ফাইল মুছে ফেলা
else if (command === "rm") {
  const filename = args[1];
  if (!filename) return console.log("Please provide a file name.");
  fs.unlinkSync(filename);
  console.log(`File '${filename}' deleted.`);
}

// 4. ফাইল কপি করা
else if (command === "cp") {
  const [source, destination] = args.slice(1);
  if (!source || !destination) return console.log("Provide source and destination.");
  fs.copyFileSync(source, destination);
  console.log(`File copied from '${source}' to '${destination}'.`);
}

// 5. ফাইল মুভ করা
else if (command === "mv") {
  const [source, destination] = args.slice(1);
  if (!source || !destination) return console.log("Provide source and destination.");
  fs.renameSync(source, destination);
  console.log(`File moved from '${source}' to '${destination}'.`);
}

// 6. সার্ভার পিং করা
else if (command === "ping") {
  const host = args[1];
  if (!host) return console.log("Please provide a host.");
  
  // Different ping commands for Windows vs Linux/macOS
  const pingCommand = os.platform() === "win32" ? `ping -n 4 ${host}` : `ping -c 4 ${host}`;
  
  exec(pingCommand, (err, stdout) => {
    if (err) return console.error("Error:", err.message);
    console.log(stdout);
  });
}


// 7. প্রসেস লিস্ট দেখা
else if (command === "ps") {
  if (os.platform() === "win32") {
    exec("tasklist", (err, stdout) => {
      if (err) return console.error("Error:", err.message);
      console.log(stdout);
    });
  } else {
    exec("ps aux --sort=-%mem | head -10", (err, stdout) => {
      if (err) return console.error("Error:", err.message);
      console.log(stdout);
    });
  }
}

// 8. প্রসেস কিল করা
else if (command === "kill") {
  const pid = args[1];
  if (!pid) return console.log("Please provide a PID.");
  try {
    process.kill(pid, "SIGTERM");
    console.log(`Process ${pid} killed.`);
  } catch (err) {
    console.error(`Failed to kill process ${pid}:, err.message`);
  }
}

// 9. ডিস্ক স্পেস দেখা
else if (command === "disk") {
  if (os.platform() === "win32") {
    exec("wmic logicaldisk get size,freespace,caption", (err, stdout) => {
      if (err) return console.error("Error:", err.message);
      console.log(stdout);
    });
  } else {
    exec("df -h", (err, stdout) => {
      if (err) return console.error("Error:", err.message);
      console.log(stdout);
    });
  }
}

// 10. মেমোরি ব্যবহার দেখা
else if (command === "mem") {
  console.log(`Total Memory: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Free Memory: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB`);
}

// অজানা কমান্ড হ্যান্ডলিং
else {
  console.log("Unknown command! Available commands: ls, touch, rm, cp, mv, ping, ps, kill, disk, mem");
}
#!/bin/bash
pkill -f "ssh -p 443"
ssh -o StrictHostKeyChecking=no -p 443 -R0:localhost:3000 a.pinggy.io > pinggy.log 2>&1 &
sleep 5
cat pinggy.log

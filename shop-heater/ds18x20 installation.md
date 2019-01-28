Raspberry Pi 3 B with DS18S20

1.  Edit / boot/config.txt
    (add as last line of the file: dtoverlay=w1-gpio) save and reboot.

2.  Make sure you have the latest version of NPM (npm install npm@latest -g)

3.  sudo npm install ds18x20 -g

4.  hook up temperature sensor(s) if not already hooked up.

5.  from the command prompt type: sudo modprobe w1-gpio

6.  from the command prompt type: sudo modprobe w1-therm

7.  to get the ID of sensors follow path to:/sys/bus/w1/devices
 
8.  from the command prompt type: ls
    (the sensor ID's should be listed there)

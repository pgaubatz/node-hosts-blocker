# Hosts-Blocker 
[![npm version](https://badge.fury.io/js/hosts-blocker.svg)](http://badge.fury.io/js/hosts-blocker)
[![Build Status](https://travis-ci.org/pgaubatz/node-hosts-blocker.svg?branch=master)](https://travis-ci.org/pgaubatz/node-hosts-blocker)
[![Coverage Status](https://coveralls.io/repos/pgaubatz/node-hosts-blocker/badge.svg?branch=master)](https://coveralls.io/r/pgaubatz/node-hosts-blocker?branch=master)
[![Dependency Status](https://david-dm.org/pgaubatz/node-hosts-blocker.svg)](https://david-dm.org/pgaubatz/node-hosts-blocker)

Hosts-Blocker can be used to block ads, malware and spyware using the [hosts file](http://en.wikipedia.org/wiki/Hosts_%28file%29).

Hosts-Blocker comes with a simple command line tool called `nhb` (node hosts blocker) that can do two things for you:

1. It downloads, merges and sorts hosts files from a configurable list of URLs and generates a new hosts file that aggregates the content of all downloaded hosts files. 
2. It runs a small HTTP server that "catches" the redirected HTTP requests.

# Installation
The recommended way of installing hosts-blocker is by using using [npm](http://npmjs.org):

    $ npm install -g hosts-blocker

This will install the `nhb` executable in your `$PATH`.

# Usage

### Configuring Hosts-Blocker

First of all you have to configure a **hosts-list** and an optional **whitelist**.
You may start with the provided example files:

* [hosts-list.example.txt](https://raw.githubusercontent.com/pgaubatz/node-hosts-blocker/master/hosts-list.example.txt)
* [whitelist.example.txt](https://raw.githubusercontent.com/pgaubatz/node-hosts-blocker/master/whitelist.example.txt)

The **hosts-list** contains a list of URLs (i.e., one URL per line) of hosts files to be downloaded, merged and sorted.

The **whitelist** contains a list of **hostname patterns** (i.e., one pattern per line) to be excluded from the generated hosts file. A **hostname pattern** can either be a simple string or a regular expression.

In this example, we will put both files into the directory `/etc/hosts-blocker` (i.e., `/etc/hosts-blocker/list` and `/etc/hosts-blocker/whitelist`).

### Configuring [Dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html)

First, add the following line to `/etc/dnsmasq.conf`:

    addn-hosts=/etc/hosts.block

This instructs `dnsmasq` to use `/etc/hosts.block` as an additional hosts file (besides the ordinary `/etc/hosts`).
Don't forget to reload `dnsmasq` for activating this new setting!

### Generating a hosts file

Next, you can then use the following command to generate the `/etc/hosts.block` file and tell `dnsmasq` to reload all registered hosts files (using `killall -HUP dnsmasq`):

    nhb generate \
      --hosts-list /etc/hosts-blocker/list \
      --whitelist /etc/hosts-blocker/whitelist \
      --destination-ip 127.1.1.1 \
      --ui-hostname hosts-blocker.local \
      --output /etc/hosts.block \
    && killall -HUP dnsmasq

You may also want to run this command regularly (e.g., weekly or even daily) using `cron`.

### Starting the catch-all HTTP server

Finally, you may want to start the catch-all HTTP server using the following command:
    
    nhb server \
        --listen-ip 127.1.1.1 \
        --ui-hostname hosts-blocker.local
    
This HTTP server will "gracefully" return a HTTP 204 (No Content) for any request to any blocked hostname. For example, if the hostname `ads.somecompany.com` is contained in the blocked hosts file (e.g., `/etc/hosts.block`) then any request like `GET http://ads.somecompany.com/banner.png` will return HTTP 204 (No Content).

Note that the (rudimentary) Web-UI, which is available at http://hosts-blocker.local, can be used to get a live view of blocked requests.

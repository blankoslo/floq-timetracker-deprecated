# Timestamp

[![Build Status](https://travis-ci.org/blankoslo/timestamp.svg?branch=master)](https://travis-ci.org/blankoslo/timestamp)<Paste>

Timetracking for Blank

## Getting started
First you need to have timestamp-backend running on a node server

    npm install
    npm start

## Intranet config
    {
        "short_name": "timestamp",
        "name": "Timeføring",
        "script": "http://localhost:8080/app.bundle.js",
        "config": {
            "apiUrl": "http://localhost:3001"
        }
    }

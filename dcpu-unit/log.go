// This file is subject to a 1-clause BSD license.
// Its contents can be found in the enclosed LICENSE file.

package main

import (
	"fmt"
	"io"
)

// Log writes log output to a given writer in a threadsafe fashion
type Log struct {
	w     io.WriteCloser
	queue chan string
	level int
}

// NewLog constructs a new Log instance for the given writer.
func NewLog(w io.WriteCloser, level int) *Log {
	if level < 0 {
		level = 0
	}

	if level > 3 {
		level = 3
	}

	l := new(Log)
	l.w = w
	l.queue = make(chan string)
	l.level = level
	go l.poll()
	return l
}

func (l *Log) Close() error {
	close(l.queue)
	return l.w.Close()
}

// Write writes a formatted message into the log.
//
// This message is added to a queue and may therefor not immediately
// persist to the underlying writer.
func (l *Log) Write(level int, f string, argv ...interface{}) {
	if level <= l.level {
		l.queue <- fmt.Sprintf("[i] %s\n", fmt.Sprintf(f, argv...))
	}
}

// poll checks the queue for pending messages and pushes them
// to the underlying writer.
func (l *Log) poll() {
	for {
		select {
		case data := <-l.queue:
			if len(data) == 0 {
				return
			}

			l.w.Write([]byte(data))
		}
	}
}

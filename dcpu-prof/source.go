// This file is subject to a 1-clause BSD license.
// Its contents can be found in the enclosed LICENSE file.

package main

import (
	"bufio"
	"bytes"
	"github.com/jteeuwen/dcpu/cpu"
	"io"
	"os"
	"strings"
)

var sourceCache map[cpu.Word]string

func init() {
	sourceCache = make(map[cpu.Word]string)
}

// GetSourceLines returns a range of lines from the given file.
func GetSourceLines(file string, start, end int) []string {
	var lines []string

	fd, err := os.Open(file)
	if err != nil {
		return nil
	}

	defer fd.Close()

	if end == -1 {
		// Get all of it.
		var b bytes.Buffer
		io.Copy(&b, fd)
		code := strings.TrimRight(b.String(), " \t\r\n")
		lines = strings.Split(code, "\n")
	}

	var data []byte
	r := bufio.NewReader(fd)

	count := 1 // line number start at 1, not 0.

	for {
		data, _, err = r.ReadLine()

		if count >= start && count <= end {
			lines = append(lines, string(data))
		}

		if err != nil || count > end {
			break
		}

		count++
	}

	return lines
}

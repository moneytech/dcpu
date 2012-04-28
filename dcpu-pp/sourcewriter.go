// This file is subject to a 1-clause BSD license.
// Its contents can be found in the enclosed LICENSE file.

package main

import (
	"io"
)

// writeSource writes the given AST out as assembly source to the
// supplied writer. It optionally scrambles label names and references
// to them.
func writeSource(w io.Writer, ast *AST) (err error) {
	return
}

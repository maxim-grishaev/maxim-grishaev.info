package gcp

import (
	"fmt"
	"os"
	"path/filepath"
)

func ReadStaticFile(relPath string) []byte {
	absPath, err := filepath.Abs(relPath)
	if err != nil {
		panic(fmt.Sprintf("Don't know abs for %s", relPath))
	}

	contents, err := os.ReadFile(absPath)
	if err != nil {
		panic(fmt.Sprintf("Can't read %s", absPath))
	}

	return contents
}

package gcp

import (
	"log"
	"net/http"
)

type Static struct {
	URLPattern string
	LocalPath  string
}

func handleStatic(s Static) {
	log.Printf("Static %s %s", s.URLPattern, s.LocalPath)
	fs := http.FileServer(http.Dir(s.LocalPath))
	http.Handle(s.URLPattern, http.StripPrefix("/static/", fs))
}

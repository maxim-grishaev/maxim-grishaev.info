package gcp

import (
	"log"
	"net/http"
)

type Route struct {
	URLPattern  string
	Content     []byte
	ContentType string
}

func handleRoute(r Route) {
	log.Printf("Route %s %s %d", r.URLPattern, r.ContentType, len(r.Content))
	http.HandleFunc(r.URLPattern, func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Content-Type", r.ContentType)
		w.Write(r.Content)
	})
}

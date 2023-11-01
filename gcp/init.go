package gcp

import (
	"log"
	"net/http"
)

func init() {
	handleRoute(Route{
		URLPattern:  "/",
		Content:     ReadStaticFile("./client/index.html"),
		ContentType: "text/html",
	})

	handleRoute(Route{
		URLPattern:  "/favicon.ico",
		Content:     ReadStaticFile("./client/favicon.ico"),
		ContentType: "image/x-icon",
	})

	http.HandleFunc("*", func(w http.ResponseWriter, req *http.Request) {
		log.Printf(req.Method, req.URL.Path)
		w.Write([]byte("Hello there! 👋"))
	})
}

func init() {
	handleStatic(Static{
		URLPattern: "/static/",
		LocalPath:  "./client/static",
	})
}

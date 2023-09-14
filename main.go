package main

import (
	"github.com/gofiber/fiber/v2"
	"os"
)

func main() {
	app := fiber.New()

	app.Static("/", "./static")
	app.All("*", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).SendString("404. Bye World! 👋")
	})

	port := "8080"
	if envPort := os.Getenv("PORT"); envPort != "" {
		port = envPort
	}
	app.Listen(":" + port)
}

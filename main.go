package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo"
)

func getMain(c echo.Context) error {
	return c.String(http.StatusOK, "Hello world!")
}

func getProfile(c echo.Context) error {
	user := c.Param("user")
	return c.String(http.StatusOK, fmt.Sprintf("Hello %s!", user))
}

func server() {
	e := echo.New()
	e.GET("/", getMain)
	e.GET("/profile/:user", getProfile)
	e.Logger.Fatal(e.Start(":8888"))
}

func main() {
	server()
}

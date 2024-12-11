package main

import (
	"context"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/yantology/fullstack-golang-react-remixjs-chat-webSockets/backend/internal/websocket"
)

const (
	readHeaderTimeoutSeconds = 3
)

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	log.Println("WebSocket endpoint hit")
	ws, err := websocket.Upgrade(w, r)
	if err != nil {
		log.Printf("WebSocket upgrade error: %+v\n", err)
		http.Error(w, "Could not upgrade to WebSocket", http.StatusInternalServerError)
		return
	}

	client := &websocket.Client{
		Conn:  ws,
		Pool:  pool,
		Write: make(chan websocket.Message),
	}

	pool.Register <- client

	ctx, cancel := context.WithCancel(context.Background())
	var wg sync.WaitGroup
	var once sync.Once

	cancelOnce := func() {
		once.Do(cancel)
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		client.Read(ctx, cancelOnce)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		client.Ping(ctx, cancelOnce)
	}()

	wg.Wait()
	err = client.Conn.Close()
	if err != nil {
		log.Printf("client close error: %s", err.Error())
	} else {
		log.Println("client closed normally")
	}
}

func setupRoutes() {
	pool := websocket.NewPool()
	go pool.Start()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
}

func main() {
	log.Println("Realtime Chat App v0.01")
	setupRoutes()

	server := &http.Server{
		Addr:              ":8080",
		ReadHeaderTimeout: readHeaderTimeoutSeconds * time.Second,
	}

	err := server.ListenAndServe()
	if err != nil {
		panic(err)
	}
}

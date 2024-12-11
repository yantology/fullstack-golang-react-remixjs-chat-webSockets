package websocket

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

var pongWait = 5 * time.Second
var pingPeriod = (pongWait * 9) / 10

type Connection interface {
	WriteJSON(v interface{}) error
	WriteControl(messageType int, data []byte, deadline time.Time) error
	ReadMessage() (messageType int, p []byte, err error)
	Close() error
	SetPongHandler(h func(appData string) error)
	SetPingHandler(h func(appData string) error)
	SetReadDeadline(t time.Time) error
	SetWriteDeadline(t time.Time) error
}

type Client struct {
	ID    string
	Conn  Connection
	Pool  *Pool
	Write chan Message
}

func (c *Client) Read(ctx context.Context, cancel context.CancelFunc) {
	defer func() {
		if ctx.Err() != context.Canceled {
			cancel()
		}
		fmt.Println("Read goroutine closed")
	}()
	defer func() {
		c.Pool.Unregister <- c
	}()

	c.Conn.SetPongHandler(func(appData string) error {
		log.Println("Pong received")
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	c.Conn.SetPingHandler(func(appData string) error {
		log.Println("Ping received")
		c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
		err := c.Conn.WriteControl(websocket.PongMessage, []byte(`pong`), time.Time{})
		if err != nil {
			cancel()
			log.Printf("user pong error %s", err.Error())
		}
		return nil
	})

	for {
		select {
		case <-ctx.Done():
			log.Println("Context cancelled read, closing connection")
			return
		default:
			messageType, p, err := c.Conn.ReadMessage()
			if err != nil {
				cancel()
				log.Printf("user message error %s", err.Error())
				return
			}
			message := Message{Type: messageType, Body: string(p)}
			c.Pool.Broadcast <- message
			log.Printf("Message Received: %+v\n", message)
			c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		}
	}
}

func (c *Client) Ping(ctx context.Context, cancel context.CancelFunc) {
	defer func() {
		if ctx.Err() != context.Canceled {
			cancel()
		}
		fmt.Println("Ping goroutine closed")
	}()
	pingTinker := time.NewTicker(pingPeriod)
	defer pingTinker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("Context cancelled,ping closing connection")
			return
		case message := <-c.Write:
			if err := c.Conn.WriteJSON(message); err != nil {
				log.Println(err)
			}
		case <-pingTinker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			err := c.Conn.WriteControl(websocket.PingMessage, []byte(`ping`), time.Time{})
			if err != nil {
				cancel()
				log.Printf("user ping error %s", err.Error())
				return
			}
		}
	}
}

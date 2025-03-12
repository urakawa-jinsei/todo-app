FROM golang:1.22

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY main.go ./

RUN go build -o todo-backend .

EXPOSE 8080

CMD ["./todo-backend"]

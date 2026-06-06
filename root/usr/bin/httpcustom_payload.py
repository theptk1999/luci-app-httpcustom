#!/usr/bin/env python3
import socket, sys, threading

# Core Logic: รับคำสั่งจาก Core Engine และทำการสอดไส้ Payload ก่อนส่งต่อ
def handle_client(client_socket, target_host, target_port, payload):
    remote_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        remote_socket.connect((target_host, int(target_port)))
        # ยิง Payload ทันทีที่เชื่อมต่อติด (Injection)
        remote_socket.send(payload.replace('\\r\\n', '\r\n').encode())
        
        # วนลูปส่งข้อมูลไป-กลับ (Full-duplex bridging)
        def forward(src, dst):
            try:
                while True:
                    data = src.recv(8192)
                    if not data: break
                    dst.send(data)
            except: pass
            
        threading.Thread(target=forward, args=(client_socket, remote_socket)).start()
        threading.Thread(target=forward, args=(remote_socket, client_socket)).start()
    except Exception as e:
        client_socket.close()

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('127.0.0.1', 8989))
server.listen(5)
print(f"Injector listening on 127.0.0.1:8989")

while True:
    client_sock, addr = server.accept()
    threading.Thread(target=handle_client, args=(client_sock, sys.argv[1], sys.argv[2], sys.argv[3])).start()

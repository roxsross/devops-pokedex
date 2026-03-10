# ---- Build stage ----
FROM python:3.12-alpine AS builder

WORKDIR /build

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---- Runtime stage ----
FROM python:3.12-alpine

RUN apk add --no-cache curl

RUN addgroup -S appuser && adduser -S appuser -G appuser -s /sbin/nologin

WORKDIR /app

COPY --from=builder /install /usr/local
COPY . .

RUN chown -R appuser:appuser /app

USER appuser

ENV WORKERS=2

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 --workers ${WORKERS}"]

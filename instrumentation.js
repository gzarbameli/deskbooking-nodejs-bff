import { metrics } from "@opentelemetry/api"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { Resource } from "@opentelemetry/resources"
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'react-frontend',
  })
)

const traceExporter = new OTLPTraceExporter({
  url: 'http://otel-collector-daemonset-collector.otel-collector.svc.cluster.local:4317',
  headers: {},
})

const metricExporter = new OTLPMetricExporter({
  url: 'http://otel-collector-daemonset-collector.otel-collector.svc.cluster.local:4317',
  concurrencyLimit: 1,
})

const meterProvider = new MeterProvider({
  resource: resource,
})

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
})

meterProvider.addMetricReader(metricReader)

// Set this MeterProvider to be global to the app being instrumented.
metrics.setGlobalMeterProvider(meterProvider)

export function getMeter() {
  return metrics.getMeter('react-frontend' || "")
}

const sdk = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
})

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk
  .start()
  .then(() => console.log("Tracing initialized"))
  .catch((error) => console.log("Error initializing tracing", error))

// gracefully shut down the SDK on process exit
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0))
})
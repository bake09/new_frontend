<template>
  <q-page padding>
    <q-table
      title="Call Detail Records ANDREA MERKLE 380 KW36_2025"
      separator="cell"
      dense
      :rows="cdrStore.cdrs" 
      :loading="cdrStore.isLoading" 
    />
    <div class="row q-gutter-md q-mt-md">
      <q-card class="col q-pa-none">
        <q-card-section>
          <q-spinner v-if="cdrStore.isLoading" />
          <VueApexCharts v-else height="180" type="pie" :options="optionsAnrufe" :series="seriesAnrufe" />
        </q-card-section>
      </q-card>
      <q-card class="col q-pa-none">
        <q-card-section>
          <q-spinner v-if="cdrStore.isLoading" />
          <VueApexCharts type="bar" height="180" :options="optionsInternExtern" :series="seriesInternExtern" />
        </q-card-section>
      </q-card>
      <q-card class="col q-pa-none">
        <q-card-section>
          <q-spinner v-if="cdrStore.isLoading" />
          <VueApexCharts type="donut" height="180" :options="optionsConnected" :series="seriesConnected" />
        </q-card-section>
      </q-card>
    </div>
    <div class="row q-gutter-md q-mt-md">
      <!-- <q-card class="col q-pa-none">
        <q-card-section>
          <q-spinner v-if="cdrStore.isLoading" />
          <VueApexCharts type="bar" height="180" :options="optionsWeekday" :series="seriesWeekday" />
        </q-card-section>
      </q-card> -->
      <q-card class="col q-pa-none">
        <q-card-section>
          <q-spinner v-if="cdrStore.isLoading" />
          <VueApexCharts type="bar" height="270" :options="options" :series="series" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import VueApexCharts from "vue3-apexcharts";

import { storeToRefs } from 'pinia';
import { useCdrStore } from 'src/stores/cdr-store';
const cdrStore = useCdrStore();
const { totalCdrsCount } = storeToRefs(cdrStore);

onMounted(() => {
  cdrStore.fetchCdrs();
});

// Pie Anrufe
const chartTitle = computed(() => `Anrufe Total: ${totalCdrsCount.value}`)
const optionsAnrufe = computed(() => ({
  title: {
    text: chartTitle.value,
    align: 'left'
  },
  chart: { id: 'apex-pie' },
  markers: { size: 4, hover: { sizeOffset: 6 } },
  labels: ['Eingehende Anrufe', 'Ausgehende Anrufe'],
  colors: ['#f2711c', '#21ba45'],
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex];
    }
  }
}))
const seriesAnrufe = computed(() => [
  cdrStore.totalIncomingCount,
  cdrStore.totalOutgoingCount
])


// Bar Inter/Extern
const optionsInternExtern = {
  title: {
    text: 'Interne / Externe Anrufe',
    align: 'left'
  },
  chart: { type: 'bar' },
  xaxis: { categories: ['Intern', 'Extern'] },
  colors: ['#39c0ed', '#f2711c']
}
const seriesInternExtern = computed(() => [{
  name: 'Anrufe',
  data: [cdrStore.totalInternCallsCount, cdrStore.totalExternCallsCount]
}])



// Donut Connected
const optionsConnected = {
  title: {
    text: 'Angenommene / Nicht angenommene Anrufe',
    align: 'left'
  },
  labels: ['Angenommen', 'Nicht angenommen'],
  colors: ['red', 'green'],
  colors: ['#21ba45', '#db2828'],
  dataLabels: {
    enabled: true,
    formatter: (val, opts) => opts.w.config.series[opts.seriesIndex]
  }
}
const seriesConnected = computed(() => [
  cdrStore.totalCallsConectedCount,
  cdrStore.totalCallsNotConectedCount
])






const weekdayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
// NEU
const callsGroupedStacked = computed(() => {
  // [wochentag][gruppe][status]
  // gruppe: 0=intern, 1=extern
  // status: 0=angenommen, 1=nicht angenommen
  const data = Array.from({ length: 7 }, () => [
    [0, 0], // intern: [angenommen, nicht angenommen]
    [0, 0]  // extern: [angenommen, nicht angenommen]
  ])
  cdrStore.cdrs.forEach(cdr => {
    const date = new Date(cdr.starttime)
    let day = (date.getDay() + 6) % 7 // Mo=0, So=6
    const gruppe = cdr.incoming ? 0 : 1 // 0=intern (eingehend), 1=extern (ausgehend)
    const status = cdr.answered ? 0 : 1 // 0=angenommen, 1=nicht angenommen
    data[day][gruppe][status]++
  })
  return data
})
const options = {
  chart: {
    type: 'bar',
    stacked: true,
    stackType: 'normal',
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '60%',
      // grouped: true ist Standard, aber explizit möglich:
      grouped: true
    }
  },
  xaxis: {
    categories: weekdayLabels
  },
  yaxis: {
    title: { text: 'Anzahl Anrufe' }
  },
  colors: ['#21ba45', '#db2828', '#39c0ed', '#f2711c'], // grün, rot, blau, orange
  legend: {
    position: 'top'
  }
}

const series = computed(() => [
  {
    name: 'Intern - Angenommen',
    data: callsGroupedStacked.value.map(day => day[0][0]),
    group: 'intern'
  },
  {
    name: 'Intern - Nicht angenommen',
    data: callsGroupedStacked.value.map(day => day[0][1]),
    group: 'intern'
  },
  {
    name: 'Extern - Angenommen',
    data: callsGroupedStacked.value.map(day => day[1][0]),
    group: 'extern'
  },
  {
    name: 'Extern - Nicht angenommen',
    data: callsGroupedStacked.value.map(day => day[1][1]),
    group: 'extern'
  }
])
</script>

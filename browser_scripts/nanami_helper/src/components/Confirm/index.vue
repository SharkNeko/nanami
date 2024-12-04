<template>
  <teleport :to="target">
    <div
      v-if="isVisible"
      class="confirm-wrapper"
      :class="{ 'confirm-enter': isEntering, 'confirm-leave': isLeaving }"
    >
      <div class="confirm-content">
        <h3 class="confirm-title">{{ title }}</h3>
        <p class="confirm-message">{{ content }}</p>
        <div class="confirm-buttons">
          <button @click="handleCancel">取消</button>
          <button @click="handleConfirm">确定</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      isEntering: false,
      isLeaving: false,
      title: '',
      content: '',
      resolve: null,
      reject: null,
      target: '#nnm-helper-panel',
    }
  },
  methods: {
    open({ title, content }) {
      this.title = title || '确认'
      this.content = content || ''
      this.isVisible = true
      this.isEntering = true

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    handleConfirm() {
      this.close(true)
    },
    handleCancel() {
      this.close(false)
    },
    close(result) {
      this.isLeaving = true
      this.isEntering = false
      setTimeout(() => {
        this.isVisible = false
        this.isLeaving = false
        if (result) {
          this.resolve()
        } else {
          this.reject()
        }
      }, 300)
    },
  },
}
</script>

<style>
.confirm-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.confirm-wrapper.confirm-enter {
  transform: translateY(0);
}

.confirm-wrapper.confirm-leave {
  transform: translateY(-100%);
}

.confirm-content {
  padding: 20px;
}

.confirm-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.confirm-message {
  font-size: 16px;
  margin-bottom: 20px;
}

.confirm-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-buttons button {
  padding: 5px 15px;
  font-size: 14px;
  cursor: pointer;
}
</style>

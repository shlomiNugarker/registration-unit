import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  registrationForm!: FormGroup;
  capturedImage: string | null = null;

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      language: ['', Validators.required],
      phone: ['', Validators.required],
      customerFace: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form submitted:', this.registrationForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  captureImage() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const context = canvas.getContext('2d');
          context?.drawImage(video, 0, 0, canvas.width, canvas.height);

          this.capturedImage = canvas.toDataURL('image/png');

          this.registrationForm.patchValue({
            customerFace: this.capturedImage,
          });

          video.srcObject = null;
          stream.getTracks().forEach((track) => track.stop());
        };
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
  }
}

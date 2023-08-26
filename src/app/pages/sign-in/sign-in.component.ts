import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

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
      preferredLanguage: 'EN',
      phone: ['', [Validators.required, this.phoneValidator()]],
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

  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const validPhonePattern = /^[0-9]{10}$/; // Adjust the pattern based on your requirement
      const valid = validPhonePattern.test(control.value);
      return valid ? null : { invalidPhone: true };
    };
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

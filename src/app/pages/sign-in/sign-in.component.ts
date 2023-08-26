import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
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
  noImageUrl: string =
    'https://t3.ftcdn.net/jpg/05/26/66/54/360_F_526665446_z51DM27QvvoMZ9Gkyx9gr5mkjSOmjswR.jpg';

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      preferredLanguage: 'EN',
      phone: ['', [Validators.required, this.phoneValidator()]],
      customerFace: ['' || this.noImageUrl, Validators.required],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form submitted:', this.registrationForm.value);
      alert(JSON.stringify(this.registrationForm.value, null, 2));
      this.registrationForm.reset();
      this.registrationForm.patchValue({
        preferredLanguage: 'EN',
        customerFace: this.noImageUrl,
      });
    } else {
      console.log('Form is invalid');
    }
  }

  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const validPhonePattern = /^[0-9]{10}$/;
      const valid = validPhonePattern.test(control.value);
      return valid ? null : { invalidPhone: true };
    };
  }

  captureImage(ev: MouseEvent) {
    ev.stopPropagation();
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
